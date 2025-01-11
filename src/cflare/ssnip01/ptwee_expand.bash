find public/assets -name '*.ptwee' \
    | while read f ; do
        {
            echo -n '<tw-passagedata pid="{pid}" name="{pageName}" tags="" position="225,100" size="100,100">'
            cat $f \
                | perl -pe 's/&/&amp;/g; s/</&lt;/g; s/>/&gt;/g; s/"/&quot;/g; s/'\''/&apos;/g'
            echo "</tw-passagedata>"
        } > ${f}.txt
    done
    
find public/assets -name '*.btwee' \
    | while read f ; do
        {
            cat $f \
                | perl -pe 's/&/&amp;/g; s/</&lt;/g; s/>/&gt;/g; s/"/&quot;/g; s/'\''/&apos;/g'
        } > ${f}.txt
    done